import React from 'react'

function Settings() {
  return (
    <div>
        <div className='settings-header'>
            <h1>System Settings</h1>
            <p>Configure Your prefrences</p>
        </div>
        <div>
            <h2>Profile & account</h2>
            <div>
                <div>
                <img src=""/>
                </div>
                <div>
                <h3>Change Avatar</h3>
                <p>JPG,GIF or PNG ,Max size of 800kb</p>
                </div>
            </div>
            <div>
                <div>
            <p>Full Name</p>
            <p></p>
            </div>
            <div>
                <p>Email Address</p>
                <p></p>
            </div>
            </div>
        </div>
        <div>
            <h1>Notifications</h1>
            <div>
                <div>
                    <h2>Email Notifications</h2>
                    <p>Receive daily summaries and critical alerts via Email</p>
                </div>
                <div>
                    {/* toggle */}
                </div>
            </div>
             <div>
                <div>
                    <h2>Push Notifications</h2>
                    <p>Get real-time updates on mobile devices </p>
                </div>
                <div>
                    {/* toggle */}
                </div>
            </div>
             <div>
                <div>
                    <h2>Sms Alerts</h2>
                    <p>Receive SMS for urgent updates</p>
                </div>
                <div>
                    {/* toggle */}
                </div>
            </div>
        </div>
        <div>
            <h1>Security</h1>
            <div>
                <div>
                    <div>
                        <div>
                            {/* icon */}
                        </div>
                        <div>
                            <h2>password</h2>
                            <p>Last changed 3 month ago</p>
                        </div>
                        
                    </div>
                    <div>
                        <p>Change</p>
                    </div>
                </div>
            </div>
             <div>
                <div>
                    <div>
                        <div>
                            {/* icon */}
                        </div>
                        <div>
                            <h2>Two-factor Authentication</h2>
                            <p>Add an extra layer of security</p>
                        </div>
                        
                    </div>
                    <div>
                        <p>Enable</p>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <button>cancel </button>
            <button>Save changes</button>
        </div>
    </div>
  )
}

export default Settings